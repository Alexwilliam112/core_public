import '../stylesheets/global.css';

export default function DocumentStatus({ selected, setter }) {

    switch (selected) {
        case 'Draft': {
            return (
                <div className="docStatusGroup">
                    <div className="docStatusButtonSelected" onClick={() => {setter('Draft')}}>
                        Draft Document
                    </div>
                    <div className="docStatusButton" onClick={() => {setter('On Process')}}>
                        On Process
                    </div>
                    <div className="docStatusButton" onClick={() => {setter('Posted')}}>
                        Posted Document
                    </div>
                    <div className="topBorder"></div>
                </div>
            )
        }

        case 'On Process': {
            return (
                <div className="docStatusGroup">
                    <div className="docStatusButton" onClick={() => {setter('Draft')}}>
                        Draft Document
                    </div>
                    <div className="docStatusButtonSelected" onClick={() => {setter('On Process')}}>
                        On Process
                    </div>
                    <div className="docStatusButton" onClick={() => {setter('Posted')}}>
                        Posted Document
                    </div>
                    <div className="topBorder"></div>
                </div>
            )
        }

        case 'Posted': {
            return (
                <div className="docStatusGroup">
                    <div className="docStatusButton" onClick={() => {setter('Draft')}}>
                        Draft Document
                    </div>
                    <div className="docStatusButton" onClick={() => {setter('On Process')}}>
                        On Process
                    </div>
                    <div className="docStatusButtonSelected" onClick={() => {setter('Posted')}}>
                        Posted Document
                    </div>
                    <div className="topBorder"></div>
                </div>
            )
        }

        default: {
            return (
                <div className="docStatusGroup">
                    <div className="docStatusButtonSelected" onClick={() => {setter('Draft')}}>
                        Draft Document
                    </div>
                    <div className="docStatusButton" onClick={() => {setter('On Process')}}>
                        On Process
                    </div>
                    <div className="docStatusButton" onClick={() => {setter('Posted')}}>
                        Posted Document
                    </div>
                    <div className="topBorder"></div>
                </div>
            )
        }
    }
}