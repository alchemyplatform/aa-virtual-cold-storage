import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

type EmailFormProps = {
  onSubmit: (email: string) => void | Promise<void>;
  buttonDisabled?: boolean;
};

interface IFormInput {
  email: string;
}

const EmailFormDataSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email' })
  })
  .required();

const EmailForm = ({ onSubmit, buttonDisabled }: EmailFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IFormInput>({ resolver: zodResolver(EmailFormDataSchema) });

  const _onSubmit: SubmitHandler<IFormInput> = ({ email }) => onSubmit(email);

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <Stack spacing="4px">
        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            placeholder="hello@alchemy.com"
            {...register('email', {
              required: 'This is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email'
              }
            })}
          />
          {errors.email ? (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          ) : (
            <FormHelperText>We&apos;ll never share your email.</FormHelperText>
          )}
        </FormControl>
        <Button
          padding={4}
          colorScheme="primary"
          isLoading={!buttonDisabled && isSubmitting}
          isDisabled={isSubmitting || buttonDisabled}
          type="submit"
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default EmailForm;
