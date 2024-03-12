import { Center } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';

export default function Loading() {
  return (
    <Center h="70vh">
      <Spinner thickness="4px" speed="0.75s" emptyColor="white" color="primary.500" size="xl" />
    </Center>
  );
}
