import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";
import { Footer } from "./Footer";

export const Root = () => {
  return (
    <Box>
      <Navigation />
      <Outlet />
      <Footer />
    </Box>
  );
};
