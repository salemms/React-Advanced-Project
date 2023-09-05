import React from "react";
import { useLoaderData, Link } from "react-router-dom/dist";
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { AddEvent } from "../components/AddEvent";
import {
  Text,
  Heading,
  VStack,
  Card,
  Image,
  Flex,
  Button,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
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

export const EventsPage = () => {
  const { events, categories } = useLoaderData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredEvents = selectedCategory
    ? events.filter((event) =>
        event.categoryIds.includes(Number(selectedCategory))
      )
    : events;

  const handleCategoryChange = (e) => {
    setSelectedCategory(
      e.target.value === "categories" ? null : e.target.value
    );
  };

  return (
    <>
      <div className="body" style={{ marginBottom: "80px" }}>
        <Flex direction="row" align="top" justify="center" marginTop="25px">
          <SearchBar margin="5px" />
          <Select
            width="25%"
            bgColor="white"
            color="black"
            margin="5px"
            border="2px black solid"
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
          >
            <option value="categories">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Button
            onClick={() => setIsModalOpen(true)}
            margin="5px"
            color="black"
            backgroundColor="#118a7e"
            border="2px black solid"
          >
            Add Event
          </Button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalBody>
                <AddEvent />
              </ModalBody>
              <ModalFooter>
                <Button
                  backgroundColor="#118a7e"
                  mr={3}
                  onClick={() => setIsModalOpen(false)}
                  fontWeight="bold"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        <Flex direction="row" flexWrap="wrap" align="center" justify="center">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              style={{
                height: "400px",
                width: "340px",
                margin: "10px",
                paddingBottom: "10px",
                display: "inline-block",
                textAlign: "center",
                overflow: "hidden",
                borderRadius: "1rem",
                border: " 1px #00204a solid",
                cursor: "pointer",
                backgroundColor: "#d8d7d7",
              }}
            >
              <Link to={`event/${event.id}`}>
                <Image
                  src={event.image}
                  alt="event image"
                  height="50%"
                  width="100%"
                  objectFit="cover"
                />

                <VStack padding="20px" height="40%">
                  <Text
                    border="2px"
                    borderRadius="12px"
                    padding="5px"
                    color="#5b70f3"
                    backgroundColor="white"
                  >
                    {Array.isArray(event.categoryIds) ? (
                      event.categoryIds.map((categoryId) => {
                        const category = categories.find(
                          (category) => category.id === categoryId
                        );
                        return <span key={categoryId}>{category.name}</span>;
                      })
                    ) : (
                      <span>{event.categoryIds}</span>
                    )}
                  </Text>

                  <Heading color="black" fontWeight="bold" as="h2" size="md">
                    {event.title}
                  </Heading>

                  <Text color="#5b70f3" fontStyle="italic">
                    {event.description}
                  </Text>
                  <Text color="black" fontWeight="bold" fontSize="xs">
                    Start:{" "}
                    {new Date(event.startTime).toLocaleString("en-EN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    End:{" "}
                    {new Date(event.endTime).toLocaleString("en-EN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </VStack>
              </Link>
            </Card>
          ))}
        </Flex>
      </div>
    </>
  );
};
