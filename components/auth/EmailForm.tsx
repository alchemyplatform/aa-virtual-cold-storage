import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
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
    <form onSubmit={handleSubmit(_onSubmit)} style={{ width: '70%' }}>
      <FormControl isRequired isInvalid={!!errors.email}>
        <FormLabel htmlFor="email" ms={1}>
          Email
        </FormLabel>
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
          mt={1}
        />
        <Button
          mt={3}
          px={4}
          w="full"
          colorScheme="primary"
          isLoading={!buttonDisabled && isSubmitting}
          isDisabled={isSubmitting || buttonDisabled}
          type="submit"
        >
          Submit
        </Button>
        {errors.email ? (
          <FormErrorMessage>{errors.email.message}</FormErrorMessage>
        ) : (
          <FormHelperText fontSize="xs" color="gray.300">
            *We&apos;ll never share your email.
          </FormHelperText>
        )}
      </FormControl>
    </form>
  );
};

export default EmailForm;
