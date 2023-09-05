import React, { useReducer } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import {
  VStack,
  Flex,
  Heading,
  Text,
  Image,
  Stack,
  Center,
  Input,
  Box,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  const users = await fetch("http://localhost:3000/users");
  const categories = await fetch("http://localhost:3000/categories");

  return {
    events: await events.json(),
    users: await users.json(),
    categories: await categories.json(),
  };
};

const initialState = {
  isEditing: false,
  editedEvent: null,
  isDeleteModalOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "EDIT":
      return { ...state, isEditing: true, editedEvent: action.payload };
    case "CANCEL_EDIT":
      return { ...state, isEditing: false, editedEvent: null };
    case "OPEN_DELETE_MODAL":
      return { ...state, isDeleteModalOpen: true };
    case "CLOSE_DELETE_MODAL":
      return { ...state, isDeleteModalOpen: false };
    default:
      return state;
  }
};

export const EventDetailPage = () => {
  const { events, categories, users } = useLoaderData();
  const { eventId } = useParams();
  const toast = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const event = events.find((event) => event.id === parseInt(eventId));
  const createdBy = users.find((user) => user.id === event?.createdBy);
  const eventCategory =
    event && event.categoryIds
      ? categories.find((category) => event.categoryIds.includes(category.id))
      : null;

  const handleEdit = (editedEvent) => {
    dispatch({ type: "EDIT", payload: editedEvent });
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const handleSave = async (editedEvent) => {
    try {
      const response = await fetch(
        `http://localhost:3000/events/${editedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedEvent),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast({
        title: "Event updated",
        description: "You've successfully edited this event.",
        status: "success",
        isClosable: true,
      });

      dispatch({ type: "CANCEL_EDIT" });
    } catch (error) {
      console.error("Event could not be updated", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      toast({
        title: "Event Deleted",
        description: "You've successfully deleted this event.",
        status: "success",
        isClosable: true,
      });

      dispatch({ type: "CLOSE_DELETE_MODAL" });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div
      className="event-detailpage"
      style={{
        backgroundColor: "white",
      }}
    >
      <Flex
        width="90vw"
        height="80vh"
        direction="row"
        justify="center"
        align="center"
        marginLeft="50px"
      >
        <Image
          src={event.image}
          alt="event-image"
          width="60%"
          height="80%"
          objectFit="cover"
          borderRadius="8%"
        />
        {state.isEditing ? (
          <Box
            backgroundColor="#e7eaf6"
            borderRadius="8%"
            display="flex"
            direction="column"
            justify="center"
            align="center"
            overflow="auto"
            margin="10px"
            width="40%"
            height="80%"
          >
            <VStack width="50%" marginLeft="25%">
              <FormControl>
                <Heading size="lg" marginBottom="10px" marginTop="15px">
                  Edit this event:
                </Heading>
                <FormLabel>Title:</FormLabel>
                <Input
                  backgroundColor="white"
                  border="1px solid black"
                  value={state.editedEvent.title}
                  onChange={(e) =>
                    dispatch({
                      type: "EDIT",
                      payload: {
                        ...state.editedEvent,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description:</FormLabel>
                <Input
                  backgroundColor="white"
                  border="1px solid black"
                  value={state.editedEvent.description}
                  onChange={(e) =>
                    dispatch({
                      type: "EDIT",
                      payload: {
                        ...state.editedEvent,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Start event:</FormLabel>
                <Input
                  backgroundColor="white"
                  border="1px solid black"
                  value={state.editedEvent.startTime}
                  onChange={(e) =>
                    dispatch({
                      type: "EDIT",
                      payload: {
                        ...state.editedEvent,
                        startTime: e.target.value,
                      },
                    })
                  }
                />
                <FormLabel>End event:</FormLabel>
                <Input
                  backgroundColor="white"
                  border="1px solid black"
                  value={state.editedEvent.endTime}
                  onChange={(e) =>
                    dispatch({
                      type: "EDIT",
                      payload: {
                        ...state.editedEvent,
                        endTime: e.target.value,
                      },
                    })
                  }
                />
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  margin="18px"
                >
                  {createdBy && createdBy.image && (
                    <Image
                      borderRadius="50%"
                      maxHeight="5rem"
                      src={createdBy.image}
                      alt={createdBy.name}
                    />
                  )}
                  {createdBy && createdBy.name && (
                    <Text marginBottom="5px" mb="3" color="black">
                      Created by: {createdBy.name}
                    </Text>
                  )}
                </Flex>
              </FormControl>
              <Stack direction="row" margin="10px">
                <Button
                  bgColor="#a1dd70"
                  color="black"
                  onClick={() => handleSave(state.editedEvent)}
                  marginBottom="12px"
                >
                  Save
                </Button>
                <Button
                  bgColor="#a1dd70"
                  color="black"
                  onClick={handleCancelEdit}
                  marginBottom="12px"
                >
                  Cancel
                </Button>
              </Stack>
            </VStack>
          </Box>
        ) : (
          <Flex
            backgroundColor="#e7eaf6"
            borderRadius="8%"
            direction="column"
            justify="center"
            align="center"
            margin="10px"
            width="40%"
            height="80%"
          >
            <Heading color="black" marginBottom="10px">
              {event.title}
            </Heading>
            <Text
              color="black"
              fontWeight="bold"
              fontStyle="italic"
              marginBottom="20px"
            >
              {event.description}
            </Text>
            <Text color="black">
              Start:{" "}
              {new Date(event.startTime).toLocaleString("en-EN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text color="black">
              End:{" "}
              {new Date(event.endTime).toLocaleString("en-EN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {eventCategory && eventCategory.name && (
              <Text color="black" fontWeight="bold" margin="15px">
                Category: {eventCategory.name}
              </Text>
            )}
            {createdBy && createdBy.image && (
              <Image
                borderRadius="50%"
                maxHeight="5rem"
                src={createdBy.image}
                alt={createdBy.name}
              />
            )}
            {createdBy && createdBy.name && (
              <Text marginBottom="5px" mb="3" color="black">
                Created by: {createdBy.name}
              </Text>
            )}
          </Flex>
        )}
      </Flex>

      {!state.isEditing && (
        <Center>
          <Button
            color="black"
            backgroundColor="#a1dd70"
            size="lg"
            onClick={() => handleEdit(event)}
          >
            Edit this event
          </Button>
          <Button
            color="black"
            backgroundColor="#c13131"
            size="lg"
            onClick={() => dispatch({ type: "OPEN_DELETE_MODAL" })}
            marginLeft="1rem"
          >
            Delete event
          </Button>
        </Center>
      )}

      <Modal
        isOpen={state.isDeleteModalOpen}
        onClose={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter>
            <Button
              color="black"
              backgroundColor="#a1dd70"
              onClick={() => handleDelete(event.id)}
            >
              Yes
            </Button>
            <Button
              color="black"
              backgroundColor="#bc2525"
              marginLeft="8px"
              onClick={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
