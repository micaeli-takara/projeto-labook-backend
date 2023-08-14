import z from 'zod';

export interface SignupInputDTO {
    name: string;
    email: string;
    password: string;
}

export interface SignupOutputDTO {
    token: string;
}

export const SignupSchema = z.object({
    name: z.string().min(4, "O nome deve ter no mínimo 4 caracteres.").max(10, "O nome não pode ter mais de  caracteres."),
    email: z.string().email("O email fornecido é inválido."),
    password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres.").max(10, "A senha não pode ter mais de 10 caracteres.")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e ter no mínimo 8 caracteres.")
}).transform(data => data as SignupInputDTO)
