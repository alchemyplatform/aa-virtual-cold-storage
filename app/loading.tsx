import { Center } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';

export default function Loading() {
  return (
    <Center w="100vw" h="100vh">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" size="3xl" />
    </Center>
  );
}
