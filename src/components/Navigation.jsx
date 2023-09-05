import { Button, Heading, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Spacer } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <>
      <Flex direction="row" width="100vw" bg="#118a7e">
        <Button bg="#118a7e" marginLeft="3rem">
          <Link to="/">
            <Heading color="white" size="md">
              Homepage
            </Heading>
          </Link>
        </Button>
        <Button bg="#118a7e">
          <Heading color="white" size="md">
            About
          </Heading>
        </Button>
        <Button bg="#118a7e">
          <Heading color="white" size="md">
            Contact
          </Heading>
        </Button>
        <Spacer />
      </Flex>
    </>
  );
};
