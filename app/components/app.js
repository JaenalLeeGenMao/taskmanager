var React = require('react');
var Modal = require('./modal');
const FA = require('react-fontawesome');
import { Col, Button, Form, FormGroup, Label, Input, FormText, Jumbotron, ListGroup, ListGroupItem, Table } from 'reactstrap';
import { graphql, gql, compose } from 'react-apollo';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            name: ''
        }
    }

    render () {
        if (this.props.allTaskQuery && this.props.allTaskQuery.loading) {
            return <div>Loading...</div>
        }

        if (this.props.allTaskQuery && this.props.allTaskQuery.error) {
            return <div>Error</div>
        }

        var TasksToRender = this.props.allTaskQuery.allTasks;
        // console.log(TasksToRender);
        return (
            <Jumbotron>
                <Form>
                    <FormGroup>
                        <Label><b>Create Task</b></Label>
                        <Input type="text" placeholder="Name" value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}/>
                        <Input type="textarea" placeholder="Description" value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })}/>
                        <Button color="primary" onClick={() => this._createTask()}><FA name="plus" /> Create Task</Button>
                    </FormGroup>
                </Form>
                <Label for="taskManager"><b>Task Manager</b></Label>
                <Table id="taskManager">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>CreatedAt</th>
                        <th>UpdatedAt</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            TasksToRender.map(function(task, index) {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{task.id}</td>
                                        <td>{task.name}</td>
                                        <td>{task.description}</td>
                                        <td>{task.createdAt}</td>
                                        <td>{task.updatedAt}</td>
                                        <td>
                                            <Modal
                                                buttonLabel={ <FA name="pencil-square-o" /> }
                                                buttonTitle={ "Edit" }
                                                buttonColor={ "info" }
                                                buttonId={ task.id }
                                                buttonRefresh={ this.props.allTaskQuery }
                                                prevName={ task.name }
                                                prevDescription={ task.description } />
                                            <Modal
                                                buttonLabel={ <FA name="trash-o" /> }
                                                buttonTitle={ "Delete" }
                                                buttonColor={ "danger" }
                                                buttonId={ task.id }
                                                buttonRefresh={ this.props.allTaskQuery } />
                                        </td>
                                    </tr>
                                )
                            }.bind(this))
                        }
                    </tbody>
                </Table>
            </Jumbotron>
        )
    }

    async _createTask() {
        console.log('async is working');
        const { name, description } = this.state
        await this.props.createTaskMutation({
            variables: {
                name,
                description
            }
        })
        this.props.allTaskQuery.refetch();
    }
}

var ALL_TASK_QUERY = gql`
    query AllTasks {
        allTasks {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`

var CREATE_TASK_MUTATION = gql`
    mutation CreateTaskMutation($name: String!, $description: String!) {
        createTask(name: $name, description: $description) {
            id
        }
    }
`

module.exports = compose(
    graphql(ALL_TASK_QUERY, {name: "allTaskQuery"}),
    graphql(CREATE_TASK_MUTATION, {name: "createTaskMutation"})
)(App);
