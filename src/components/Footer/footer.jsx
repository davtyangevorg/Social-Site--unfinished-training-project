import React from 'react'
import './footer.scss'

import Photo from '../../img/footer-logo.png'
import {RiCopyrightFill} from 'react-icons/ri'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='container'>
                <div className='footer_inner'>
                    <img alt='img' src={Photo}></img>
                    <div className='copyright'>
                        <RiCopyrightFill />
                        <h5>Copyright 2019</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
