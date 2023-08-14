import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/post/getPost.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, USER_ROLES } from "../services/TokenManager";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
    ) { }

    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
        const { content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const postDB = post.toDBModel()
        await this.postDatabase.insertPost(postDB)

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public getPosts = async (
        input: GetPostInputDTO
    ): Promise<GetPostOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDBWithCreatorName = await this.postDatabase.getPostsWithCreatorsName()

        const posts = postDBWithCreatorName.map((postWithCreatorName) => {
            const post = new Post(
                postWithCreatorName.id,
                postWithCreatorName.content,
                postWithCreatorName.likes,
                postWithCreatorName.dislikes,
                postWithCreatorName.created_at,
                postWithCreatorName.updated_at,
                postWithCreatorName.creator_id,
                postWithCreatorName.creator_name
            )

            return post.toModel()
        })
        const output: GetPostOutputDTO = posts

        return output
    }

    public editPost = async (
        input: EditPostInputDTO
    ): Promise<EditPostOutputDTO> => {
        const { content, token, idToEdit } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("O Id não corresponde á nenhuma postagem")
        }

        if (payload.id !== postDB.creator_id) {
            throw new ForbiddenError("Você não tem permissão para editar este Post")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            payload.name
        )

        post.setContent(content)

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(updatedPostDB)

        const output: EditPostOutputDTO = undefined

        return output
    }


    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
        const { token, idToDelete } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("O Id não corresponde á nenhuma postagem")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postDB.creator_id) {
                throw new ForbiddenError("Você não tem permissão para editar este Post")
            }
        }

        await this.postDatabase.deletePostById(idToDelete)

        const output: DeletePostOutputDTO = undefined

        return output
    }

    public likeOrDislikePost = async (
        input: LikeOrDislikePostInputDTO
    ): Promise<LikeOrDislikePostOutputDTO> => {
        const { postId, token, like } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDBWithCreatorName = await this.postDatabase.findPostCreatorById(postId)

        if (!postDBWithCreatorName) {
            throw new NotFoundError("Esta postagem com este Id não existe")
        }

        const post = new Post(
            postDBWithCreatorName.id,
            postDBWithCreatorName.content,
            postDBWithCreatorName.likes,
            postDBWithCreatorName.dislikes,
            postDBWithCreatorName.created_at,
            postDBWithCreatorName.updated_at,
            postDBWithCreatorName.creator_id,
            postDBWithCreatorName.creator_name
        )

        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: payload.id,
            post_id: postId,
            like: likeSQLite
        }

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === POST_LIKE.ON_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()

            } else {
                await this.postDatabase.updatedLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()

            }
        } else if (likeDislikeExists === POST_LIKE.ON_DISLIKED) {
            if (!like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()

            } else {
                await this.postDatabase.updatedLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()

            }
        } else {
            await this.postDatabase.insertLikeDislike(likeDislikeDB)
            like ? post.addLike() : post.addDislike()
            
        }
        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)

        const output: LikeOrDislikePostOutputDTO = undefined

        return output
    }
}