import Image from "next/image";
import styles from "./page.module.css";

const data = {
  "Test parent": {
    "Test child": {
      "test sub child": {}
    },
    "Test child 2": {}
  }
};

const data2 = {
  "root": {
    "data": "subject",
    "children": ["1"]
  },

  "1": {
    "data": "Test parent",
    "children": ["2", "3"]
  },

  "2": {
    "data": "Test child 1",
    "children": ["4"]
  },

  "3": {
    "data": "Test child 2",
    "children": []
  },

  "4": {
    "data": "Test sub child",
    "children": []
  },
}

function DisplayData({name}){
  const obj = data2[name];

  return (
    <ul>
      <li key={name}>{obj.data}</li>
      { obj.children.length > 0 ? (
        obj.children.map((child) => {
          return (
            <DisplayData key={child.toString()} name={child} />
          );
        })
      ) : (
        <></>
      )}
    </ul>
  );
}

function TestListElement({title}){
  return <li>{title}</li>;
}

export default function Home() {
  return (
    <main >
      <div>Hello world</div>
      <p>This is a list</p>
      <DisplayData name="root" />
    </main>
  );
}
