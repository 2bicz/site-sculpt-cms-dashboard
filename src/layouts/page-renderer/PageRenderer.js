import { AppBar, Box, Button, Container, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { NavigationHeader } from "components/PageRendererComponents/Navigation/NavigationHeader";
import PageLayout from "examples/LayoutContainers/PageLayout";

export const PageRenderer = () => {
  return (
    <PageLayout background="#E8EDDF">
      {/* header */}
      <NavigationHeader sx={{ backgroundColor: "#293241", height: "100px", width: "100%", color: "#E8EDDF" }} />
      {/* header */}

      {/* main body */}
      <Container maxWidth={false} sx={{ backgroundColor: "#E8EDDF" }}>
        <Stack direction="column" spacing={2}>
          <Button>hej</Button>
          <Button>dupa</Button>
          <Button>czesc</Button>
          <Stack direction="row" spacing={2}>
            <Button>ale</Button>
            <Button>urwał</Button>
          </Stack>
        </Stack>
      </Container>
      {/* main body */}

      {/* footer */}
      <Container sx={{ backgroundColor: "#4f4f4f" }}>
        <Stack>dupa</Stack>
      </Container>
      {/* footer */}
    </PageLayout>

  );
};
