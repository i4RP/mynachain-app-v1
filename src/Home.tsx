import React, { useState, useEffect } from "react";

import { List, ListItem, ListSubheader, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Home() {
  const history = useHistory();
  return (
    <Container>

      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <a href="https://www.space0.org/">Visit our homepage</a>
          </ListSubheader>
        }
      >
        <ListItem button onClick={() => history.push("/newaccount")}>
          新しいアカウントを作成
        </ListItem>
        <ListItem button onClick={() => history.push("/Send")}>
          SPCトークンを送金する
        </ListItem>
      </List>
    </Container>
  );
}
