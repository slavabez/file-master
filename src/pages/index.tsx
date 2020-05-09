import React, { CSSProperties, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createImage } from "../graphql/mutations";
import { listImages } from "../graphql/queries";

import Amplify from "aws-amplify";
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

const initialState = { name: "", url: "" };

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchImages() {
    try {
      const imageData: any = await API.graphql(graphqlOperation(listImages));
      const images = imageData.data.listImages.items;
      setImages(images);
    } catch (err) {
      console.log("error fetching todos", err);
    }
  }

  async function addImage() {
    try {
      if (!formState.name || !formState.url) return;
      const imageObj = { ...formState };
      setImages([...images, imageObj]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createImage, { input: imageObj }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={(event) => setInput("name", event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput("url", event.target.value)}
        style={styles.input}
        value={formState.url}
        placeholder="Url"
      />
      <button style={styles.button} onClick={addImage}>
        Create Image
      </button>
      {images.map((image, index) => (
        <div key={image.id ? image.id : index} style={styles.todo}>
          <p style={styles.todoName}>{image.name}</p>
          <p style={styles.todoDescription}>{image.description}</p>
        </div>
      ))}
    </div>
  );
};

const styles: { [name: string]: CSSProperties } = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 700 },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default App;
