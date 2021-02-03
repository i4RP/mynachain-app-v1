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
            Do you need more information about Space0?
            <button><Link to='https://space0.org/' onClick={this.doSomething}>Visit our homepage</Link></button>
          </ListSubheader>
        }
      >
        <ListItem button onClick={() => history.push("/newaccount")}>
          新しいアカウントを作成
        </ListItem>
        <ListItem button onClick={() => history.push("/Send")}>
          送金
        </ListItem>
      </List>
    </Container>
  );
}
