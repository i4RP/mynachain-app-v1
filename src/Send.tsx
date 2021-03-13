import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { useApi } from "./Api";
import { makeStyles } from "@material-ui/core/styles";
import { Keyring } from "@polkadot/api";
import { useToasts } from "react-toast-notifications";
import { getAuthCert, signWithAuth } from "mynaconnect-lib";
import GetAccountId from "./GetAccountId";

const keyring = new Keyring({ type: "sr25519" });
const useStyles = makeStyles({
  root: {
    "& > *": {
      margin: "10px",
    },
  },
});
const i2h = (il: number[]) =>
  "0x" + il.map((i) => ("0" + i.toString(16)).slice(-2)).join("");
export default function Send() {
  const { api } = useApi();
  const { root } = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);

  const useHashInput = (initial: string) => {
    const [value, set] = useState(initial);
    let isHash = /^0x[0-9a-fA-F]{64}$/.test(value.toString());

    return {
      value,
      onChange: (e: any) => set(e.target.value),
      set,
      error: !isHash,
    };
  };

  const useIntInput = (initial: number) => {
    const [value, set] = useState(initial);
    let isNumber = /^[0-9]*$/.test(value.toString());

    return {
      value,
      onChange: (e: any) => set(e.target.value),
      set,
      error: !isNumber,
    };
  };

  const from = useHashInput("");
  const to = useHashInput("");
  const amount = useIntInput(0);
  const [log, setLog] = useState("");
  const [hash, setHash] = useState("");

  const send = async () => {
    setLoading(true);
    try {
      const forHash: any = api.tx.mynaChainModule.go({
        signature: "0x00",
        id: from.value,
        tbs: {
          Send: {
            to: to.value,
            amount: amount.value,
            nonce: 0,
          },
        },
      });

      let hash = forHash.args[0]["tbs"].hash.toHex();
      addToast("Computing a signature", {
        appearance: "info",
        autoDismiss: true,
      });
      const sig = ((await signWithAuth(
        "levia - TX署名",
        "3031300d060960864801650304020105000420" + hash.slice(2)
      )) as any).sig as number[];
      const submittable = api.tx.mynaChainModule.go({
        signature: i2h(sig),
        id: from.value,
        tbs: {
          Send: {
            to: to.value,
            amount: amount.value,
            nonce: 0,
          },
        },
      });
      const alice = keyring.addFromUri("//Alice", { name: "Alice default" });
      addToast("Waiting for the Events", {
        appearance: "info",
        autoDismiss: true,
      });
      submittable.signAndSend(alice, (e) => {
        console.log(e);
        if (e.isCompleted) setLoading(false);
        if (e.events.length == 0) return;
        e.events.forEach((m: any) => {
          const msg = m.event.meta.name.toString();
          addToast(msg, {
            appearance: "success",
            autoDismiss: true,
          });
        });
      });
    } catch (e) {
      addToast(e.toString(), {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="sm" className={root}>
      <TextField
        label="あなたのアカウント番号"
        fullWidth={true}
        placeholder="整数"
        {...from}
      />
      <GetAccountId onLoad={(data: string) => from.set(data)} />
      <TextField
        label="相手のアカウント番号"
        fullWidth={true}
        placeholder="整数"
        {...to}
      />
      <TextField
        label="送金数量"
        fullWidth={true}
        placeholder="整数"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">SPC</InputAdornment>
          ),
        }}
        {...amount}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth={true}
        onClick={send}
        disabled={from.error || amount.error}
      >
        送金
      </Button>
    </Container>
  );
}
