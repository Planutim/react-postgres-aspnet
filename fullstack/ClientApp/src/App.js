import React, { Component } from 'react';
import './custom.css';
import { InputTable } from './components/InputTable'
import { Graphics } from './components/Graphics'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputData: [],
            fetchedData: [],
            groupedData: [],
            rrd7: 0,
            showHistogram: false,
            isDataOld: true,
        }
        this.handleRegChange = this.handleRegChange.bind(this)
        this.handleLastActiveChange = this.handleLastActiveChange.bind(this)
        this.addInput = this.addInput.bind(this)
        this.addInputField = this.addInputField.bind(this)

        this.submitData = this.submitData.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.calculate = this.calculate.bind(this)
        this.calculateRRD = this.calculateRRD.bind(this)

        this.appRef = React.createRef()
    }
    componentDidMount() {
        if (this.state.inputData.length === 0) {
            this.addInputField()
        }
    }
    componentDidUpdate() {
        if (this.state.inputData.length === 0) {
            this.addInputField()
        }
    }


    async fetchData() {
        var rawResponse = await fetch("api/users")
        if (!rawResponse.ok) {
            return
        }
        var jsonResponse = await rawResponse.json()
        var formattedData = formatDate(jsonResponse)
        this.setState({
            fetchedData: formattedData,
            groupedData: groupData(formattedData).map(item => {
                return { ...item, times: 0 }
            })
        })
    }

    addInputField() {
        this.setState({
            inputData: [...this.state.inputData, {
                userID: this.state.inputData.length + 1,
                // regDate: new Date('2021-01-01').toISOString().substring(0,10),
                // lastActiveDate: new Date('2021-01-01').toISOString().substring(0,10)
            }]
        })
    }
    addInput(e) {
        e.preventDefault()
        this.addInputField()
    }
    handleRegChange(e, i) {
        this.setState({
            inputData: [...this.state.inputData.slice(0, i), { ...this.state.inputData[i], regDate: e.target.value }, ...this.state.inputData.slice(i + 1)]
        })
    }
    handleLastActiveChange(e, i) {
        // if(i===this.state.inputData.length-1){
        //   this.addInput()
        // }
        this.setState({
            inputData: [...this.state.inputData.slice(0, i), { ...this.state.inputData[i], lastActiveDate: e.target.value }, ...this.state.inputData.slice(i + 1)]
        })
    }
    async submitData(e) {
        e.preventDefault();
        const stringifiedData = JSON.stringify(this.state.inputData)
        // alert(stringifiedData)
        var rawResponse = await fetch("api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: stringifiedData
        });
        if (rawResponse.ok) {
            this.setState({
                //inputData: [],
                isDataOld: true
            })
        }
    }

    async calculate() {
        // return moment.duration(moment().diff(moment('2021-04-01'))).as('days')
        //if (!this.state.isDataOld) {
        //    return
        //}
        this.setState({
            groupedData: [],
            rrd7: 0
        })
        await this.fetchData()
        if (true || this.state.fetchedData.length > 0) {
            this.setState({
                rrd7: this.calculateRRD(7),
                showGraphics: true,
                isDataOld: false,
                groupedData: groupData(this.state.fetchedData).map(item => {
                    return {value: "", times: 0}
                })
            })
            this.appRef.current.scrollIntoView({ block: "end", behavior: "smooth" })
            setTimeout(() => {
                this.setState({
                    groupedData: groupData(this.state.fetchedData)
                })

            }, 300)
        }

    }

    calculateRRD(days) {
        const rrd = this.state.fetchedData.filter(item => {
            let diff = getDateDiff(item.lastActiveDate, item.regDate)
            return diff !== -1 && diff >= days
        }).length / this.state.fetchedData.length * 100;
        return Math.round(rrd)
    }

    renderHistogram(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) {
        console.log(actualDuration)
        console.log(baseDuration)
    }

    render() {
        return (
            <div ref={this.appRef} className="App">
                <InputTable data={this.state.inputData} onRegChange={this.handleRegChange} onLastActiveChange={this.handleLastActiveChange} addInput={this.addInput} submitData={this.submitData} />
                <div className="button-div">
                    <button className="button" onClick={this.calculate}>Calculate</button>
                </div>
                <Graphics showGraphics={this.state.showGraphics} data={this.state.groupedData} rrd7={this.state.rrd7} />
            </div>
        )
    }

}


function formatDate(items) {
    return items.map(item => {
        return { ...item, regDate: item.regDate.substring(0, 10), lastActiveDate: item.lastActiveDate.substring(0, 10) }
    })
}

function getDateDiff(lastActiveDate, regDate) {
    const lAD = Date.parse(lastActiveDate)
    const rD = Date.parse(regDate)
    if (isNaN(lAD) || isNaN(rD)) {
        return -1
    }
    return Math.floor((lAD - rD) / 1000 / 3600 / 24)
}


function groupData(data) {
    var newArr = []
    for (let i = 0; i < data.length; i++) {
        let diff = getDateDiff(data[i].lastActiveDate, data[i].regDate)
        let index = newArr.findIndex(item => item.value === diff)
        if (index !== -1) {
            newArr[index].times = newArr[index].times + 1
        } else {
            newArr.push({
                value: diff,
                times: 1
            })
        }
    }
    return newArr
}


export default App;