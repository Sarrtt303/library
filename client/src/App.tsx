import Header from "./components/Header";

import UserList from "./components/UserList";
import BookList from "./components/BookList";
import TransactionList from "./components/TransactionList";
import BookIssueForm from "./components/BookIssueForm";
import BookReturnForm from "./components/BookReturnForm";

function App() {
  

  return (
    <>
      <div className='container mx-auto'>
        <Header />
        <UserList/>
        <BookList/>
        <TransactionList/>

        <div className="flex justify-between mt-4">
          <div className="w-full max-w-md mr-4">
            <BookIssueForm />
          </div>
          <div className="w-full max-w-md ml-4">
            <BookReturnForm />
          </div>
        </div>

      </div>
    </>
  )
}

export default App
