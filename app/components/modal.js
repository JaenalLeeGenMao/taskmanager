import React from 'react';
import { Form, FormGroup, FormText, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { graphql, gql, compose } from 'react-apollo';

class ReactModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      edit: '',
      id: '',
      name: '',
      description: '',
      prevName: '',
      prevDescription: ''
    };

    this.toggle = this.toggle.bind(this);
    this.toggleEditDelete = this.toggleEditDelete.bind(this);
  }

  componentWillMount() {
      this.setState(function() {
          return {
              prevName: this.props.prevName,
              prevDescription: this.props.prevDescription
          }
      })
  }
  componentDidMount() {
      console.log(this.props.buttonTitle);
      this.setState(function() {
          return {
              id: this.props.buttonId,
              edit: this.props.buttonTitle
          }
      })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
    this.props.buttonRefresh.refetch();
  }

  toggleEditDelete() {
    ( this.state.edit === "Edit") ? this._editTask() : this._deleteTask()
    this.setState({
      modal: !this.state.modal
    });
    this.props.buttonRefresh.refetch();
  }

  render() {
    return (
      <span>
        <Button color={this.props.buttonColor} onClick={this.toggle}>{this.props.buttonLabel} {this.props.buttonTitle}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.buttonTitle}</ModalHeader>
          <ModalBody>
            {
                ( this.state.edit === "Edit") ?
                <Form>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Edit name here . ."
                            onChange={ (e) => this.setState({ name: e.target.value }) } />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Edit description here . ."
                            onChange={ (e) => this.setState({ description: e.target.value }) } />
                    </FormGroup>
                </Form>
                :
                <Form>
                    <FormGroup>
                        <Label>Once deleted you cannot undo.</Label>
                    </FormGroup>
                </Form>
            }

          </ModalBody>
          <ModalFooter>
            <Button color={this.props.buttonColor} onClick={this.toggleEditDelete}>{this.props.buttonTitle}</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }

  async _editTask() {
      const { id, name, description } = this.state
      if ( name.length ) {
          const { name } = this.state.prevName
      }
      if ( description.length ) {
          const { description } = this.state.prevDescription
      }
      console.log(name);
      console.log(description);
      await this.props.updateTaskMutation({
          variables: {
              id,
              name,
              description
          }
      })
  }

  async _deleteTask() {
      const { id } = this.state
      await this.props.deleteTaskMutation({
          variables: {
              id
          }
      })
  }
}

var UPDATE_TASK_MUTATION = gql`
    mutation UpdateTaskMutation($id: ID!, $name: String!, $description: String!) {
        updateTask(id: $id, name: $name, description: $description) {
            id
        }
    }
`

var DELETE_TASK_MUTATION = gql`
    mutation DeleteTaskMutation($id: ID!) {
        deleteTask(id: $id) {
            id
        }
    }
`

module.exports = compose(
    graphql(UPDATE_TASK_MUTATION, { name: "updateTaskMutation"}),
    graphql(DELETE_TASK_MUTATION, { name: "deleteTaskMutation"})
)(ReactModal);
