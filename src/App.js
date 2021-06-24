import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
  useQuery,
   useMutation
} from '@apollo/client';

const httpLink = createHttpLink({
   uri: "http://localhost:4000"
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

//
// Operations
//
const QUERY = gql`
query MyQuery {
  Books {
    title    
    author
  }
}
`

const ADD_BOOK = gql`
mutation AddBook($title:String!, $author:String!) {
  addBook(title:$title, author:$author) {
    title
    author
	}
}
`
function AddBook() {
  let TitleInput, AuthorInput;
  const [addBook, { data }] = useMutation(ADD_BOOK);

   console.log("@@ data")
   console.log(data)

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
           console.log(TitleInput.value)
           console.log(AuthorInput.value)
          addBook({ variables: { title: TitleInput.value, author: AuthorInput.value } });
          TitleInput.value = '';
          AuthorInput.value = '';
        }}
      >
        <label for="title">Title</label>
        <input
          name="title"
          ref={node => {
            TitleInput = node;
          }}
        />
        <label for="author">Author</label>
        <input
          name="author"
          ref={node => {
            AuthorInput = node;
          }}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

function Books() {  
  const {loading, error, data, refetch} = useQuery(QUERY)

  if (loading) return <p>loading...</p>
  
  if (error) return <p>Error:...</p>

  return (
     <div>
	     <ul>
	      {data.Books.map((d,i)=> <li key={i}>{d.title} by {d.author}</li>)}
	     </ul>
        <button onClick={()=>refetch()}> Reload! </button>
     </div>
  )
}

function App() {

  return (
    <ApolloProvider client={client}>
      <AddBook />
      <Books />
    </ApolloProvider>
  );
}

export default App;
