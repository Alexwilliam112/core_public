'use strict'

class ResponseMessages {

    constructor() {
        if (ResponseMessages.instance === undefined) {

            this.READ_ALL = 'Success Read All Document:'
            this.READ_DETAIL = 'Success Read Document with ID:'
            this.CREATE = 'Success Create:'
            this.EDIT = 'Document Updated'
            this.PATCH = 'Document'
            this.DELETE = 'Deleted'

            ResponseMessages.instance = this
        }
        return ResponseMessages.instance
    }

    readAll(docName) {
        return `${this.READ_ALL} ${docName}`
    }

    readOne(docId) {
        return `${this.READ_DETAIL} ${docId}`
    }

    create(dataName) {
        return `${this.CREATE} ${dataName}`
    }

    edit() {
        return `${this.EDIT}`
    }

    patch(new_status) {
        return `${this.PATCH} ${new_status}`
    }

    delete(dataName) {
        return `${this.DELETE} ${dataName}`
    }
}

const ResMsg = new ResponseMessages()
Object.freeze(ResMsg)
module.exports = ResMsg