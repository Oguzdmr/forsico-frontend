import React from 'react'
import "../../styles/workspaceCss/emptyhomepage.css"

const EmptyHomePage = () => {
    return (
        <div className='empty-workspace-homepage'>
            <div className="meet-message">
                <span>Good Morning, Murat!</span>
            </div>
            <div className='empty-homepage-line'></div>
            <div className='empty-double-card'>
                <div className="empty-active-workspaces">
                    <h2 className="fs-96 blue-letter">0</h2>
                    <span className="empty-active-workspace-title blue-letter-title">workspaces</span>
                </div>
                <div className="empty-active-task">
                    <h2 className="fs-96 turquoise-letter">0</h2>
                    <span className="active-task-title turquoise-letter-title">tasks</span>
                </div>
            </div>
            <div className='empty-button-area'>
                <span className='empty-button-area-title'>You Have no Workspace</span>
                <button className='empty-homepage-button'>Create Workspace</button>
            </div>
        </div>
    )
}
export default EmptyHomePage
