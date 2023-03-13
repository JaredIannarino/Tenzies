import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(1)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            console.log("You won!")
            const highScore = localStorage.getItem("count") || Infinity
            if(count < highScore){
                console.log("You got the highscore!")
                localStorage.setItem("count", count)
            }else{
                console.log("You didn't beat your highscore")
            }
        }
    }, [dice, count])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
        setCount(prevCount => prevCount + 1)
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
            Object.assign({}, die, { isHeld: !die.isHeld }) :
                die
        }))
    }
    
    function resetHeld() {
        setDice(oldDice => oldDice.map(die => Object.assign({}, die, { isHeld: false })))
    }
    
    function restartGame(){
        setTenzies(false)
        setCount(-1)
        resetHeld()
        rollDice()
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={tenzies ? restartGame : rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <h2>Roll Count: {count}</h2>
            <h2>Personal Best: {localStorage.getItem('count') || 0}</h2>
        </main>
    )
}