type Result<T> = { status: "ok"; value: T } | { status: "error"; error: Error };

function contrivedInferred(): Result<string> {
  return Math.random() > 0.5
    ? ({ status: "ok", value: "yay" } as const)
    : ({ status: "error", error: new Error("oopsies") } as const);
}

const resulInferred = contrivedInferred();

if (resulInferred.status === "ok") {
  console.log(resulInferred.value);
}

if (resulInferred.status === "error") {
  console.log(resulInferred.error);
}

// import React, { useState } from "react";
// import "./styles.css";

// type Base = {
//   id: string;
//   title: string;
// };

// type GenericSelectProps<TValue> = {
//   values: TValue[];
//   onChange: (value: TValue) => void;
// };

// export const GenericSelect = <TValue extends Base>({
//   values,
//   onChange,
// }: GenericSelectProps<TValue>) => {
//   const onSelectChange = (e) => {
//     const val = values.find((value) => value.id === e.target.value);

//     if (val) onChange(val);
//   };

//   return (
//     <select onChange={onSelectChange}>
//       {values.map((value) => (
//         <option key={value.id} value={value.id}>
//           {value.title}
//         </option>
//       ))}
//     </select>
//   );
// };

// export type Book = {
//   id: string;
//   title: string;
//   author: string;
// };

// export type Movie = {
//   id: string;
//   title: string;
//   releaseDate: string;
// };

// const books: Book[] = [
//   {
//     id: "1",
//     title: "Good omens",
//     author: "Terry Pratchett & Neil Gaiman",
//   },
//   {
//     id: "2",
//     title: "The Truth",
//     author: "Terry Pratchett",
//   },
// ];

// const movies: Movie[] = [
//   {
//     id: "1",
//     title: "Captain Marvel",
//     releaseDate: "2019",
//   },
//   {
//     id: "2",
//     title: "Good Omens",
//     releaseDate: "2019",
//   },
// ];

// export const AmazonCloneWithState = () => {
//   const [book, setBook] = useState<Book>(books[0]);
//   const [movie, setMovie] = useState<Movie>(movies[0]);

//   return (
//     <>
//       Selected book: {book.title} by {book.author}
//       <br />
//       <br />
//       Selected movie: {movie.title}, released in {movie.releaseDate}
//       <br />
//       <br />
//       Books:
//       <br />
//       <GenericSelect<Book>
//         onChange={(value) => setBook(value)}
//         values={books}
//       />
//       <br />
//       <br />
//       Movies:
//       <br />
//       <GenericSelect<Movie>
//         onChange={(value) => setMovie(value)}
//         values={movies}
//       />
//     </>
//   );
// };

// export default function App() {
//   return (
//     <div className="App">
//       <AmazonCloneWithState />
//     </div>
//   );
// }
