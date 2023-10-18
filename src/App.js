import {useState} from "react";
import logo from './logo.svg';
import {v4 as uuidv4} from 'uuid';
import './App.css';

function App() {
    const [inputValue, setInputValue] = useState("")
    const [notes, setNotes] = useState([])

    function handleChange(event) {
        setInputValue(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        setNotes(prevState => [...prevState, {id: uuidv4(), content: inputValue}])
        setInputValue("")
    }

    function handleDelete(id) {
        setNotes(prevState => prevState.filter(item => item.id !== id))
    }

    return (
        <div className="app-container">
            <h2>QA Automation Cypress Test</h2>
            <div className="list-container">
                <ul>
                    {notes.map(item => (
                        <div className="note-container">
                            <li key={item.id}>{item.content}</li>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </div>
                    ))}
                </ul>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" id="text-input" value={inputValue} onChange={e => handleChange(e)}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default App;
