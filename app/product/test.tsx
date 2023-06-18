interface TableProps<T> {
  items: { id: string }[];
  renderItems: (item: { id: string }) => React.ReactNode;
}

// export const Table = (props: TableProps) => {
//   return null;
// };
function Table<T>(props: TableProps<T>) {
  return null;
}

const Component = () => {
  return (
    <Table
      items={[
        {
          id: "1",
        },
      ]}
      renderItems={(item) => <div>{item.id}</div>}
    ></Table>
  );
};

// import { useState } from "react";

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
//           {value.id}
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
