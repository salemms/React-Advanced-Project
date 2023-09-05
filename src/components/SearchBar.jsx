import React, { useState, useEffect } from "react";
import { Box, Input, ListItem, UnorderedList } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const SearchBar = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    const events = await fetch("http://localhost:3000/events");
    const eventData = await events.json();
    setEvents(eventData);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Box bg="white">
        <Input
          mt="4px"
          color="black"
          type="search"
          placeholder="Search for events"
          width="25vw"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <UnorderedList
            color="black"
            style={{ listStyleType: "none", padding: 0 }}
          >
            {filteredEvents.map((event) => (
              <ListItem key={event.id}>
                <Link to={`event/${event.id}`}> {event.title} </Link>
              </ListItem>
            ))}
          </UnorderedList>
        )}
      </Box>
    </>
  );
};
