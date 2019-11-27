import React from 'react';
import Head from 'next/head';
import _ from 'lodash';
import reframe from 'reframe.js';
import AOS from 'aos';
import Cookies from 'js-cookie';

import '../sass/main.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';


export default class BaseLayout extends React.Component {
    componentDidMount() {

        // Responsive video embeds
        var videoEmbeds = [
            'iframe[src*="youtube.com"]',
            'iframe[src*="vimeo.com"]'
        ];
        reframe(videoEmbeds.join(','));

        // Announcement
        var cookieName = 'joboxAnncmnt';
        var cookieExp = 1;
        var showAnncmnt = function () {
        if ( Cookies.get(cookieName) ) {
            return false;
        } else {
            return true;
        }
        };

        window.addEventListener('load', function() {
        if ( showAnncmnt() ) {
            setTimeout(function(){
            document.body.classList.add('modal--opened');
            }, 3000);
        }
        });

        document.getElementById('modal-close').addEventListener('click', function () {
        document.body.classList.remove('modal--opened');
        Cookies.set(cookieName, 1, { expires: cookieExp });
        });

        // AOS
        AOS.init({
            easing: 'ease-out-back',
            duration: 1000
        });

        // Sticky header
        var offsetY = 0;
        var ticking = false;

        window.addEventListener('scroll', function (e) {
        offsetY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function () {
            handleHeader(offsetY);
            ticking = false;
            });
            ticking = true;
        }
        });

        function handleHeader(scrollPos) {
        if (scrollPos > 0)
            document.body.classList.add('has--scrolled');
        else
            document.body.classList.remove('has--scrolled');
        }

        // Mobile menu
        var menuToggle = document.querySelectorAll('.menu-toggle');

        for (var i = 0; i < menuToggle.length; i++) {
        menuToggle[i].addEventListener('click', function(e){
            document.body.classList.toggle('menu--opened');
            e.preventDefault();
        },false);
        }

        document.body.classList.remove('menu--opened');

        window.addEventListener('resize', function () {
        if (menuToggle.offsetParent === null) {
            document.body.classList.remove('menu--opened');
        }
        }, true);
    }

    render() {

        let title = _.get(this.props, 'page.frontmatter.title') ? _.get(this.props, 'page.frontmatter.title') + ' | ' + _.get(this.props, 'data.config.title') : _.get(this.props, 'data.config.title');
        let description = _.get(this.props, 'page.frontmatter.excerpt') || _.get(this.props, 'data.config.meta_desc');
        let image = _.get(this.props, 'data.config.frontmatter.img_path') || _.get(this.props, 'data.config.meta_img_path');
        let twitter_handle = '@' + _.get(this.props, 'data.config.twitter_username');
        return (
            <React.Fragment>
                <Head>
                    <title>{title}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initialScale=1.0" />
                    <meta name="description" content={description} />
                    <meta name="twitter:card" content="summary_large_image" />
                    {_.get(this.props, 'data.config.twitter_username') && <React.Fragment>
                        <meta name="twitter:site" content={twitter_handle} />
                        <meta name="twitter:creator" content={twitter_handle} />
                    </React.Fragment>}
                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={image} />
                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={image} />
                    <link rel="shortcut icon" href={ this.props.prefixAsset('favicon.png') } />
                    <link href="https://fonts.googleapis.com/css?family=DM+Sans:400,400i,500,500i%7CDM+Serif+Text:400,400i&display=swap" rel="stylesheet" />
                    {/*<link rel="stylesheet" href={this.props.prefixAsset('assets/css/main.css')}/>*/}
                </Head>
                <div id="page" className="site">
                    <Header {...this.props} />
                    <main id="content" className="site-content">
                        {this.props.children}
                    </main>
                    <Footer {...this.props} />
                </div>
                {_.get(this.props, 'data.modal.has_modal') && 
                  <Modal {...this.props} />
                }
            </React.Fragment>
        );
    }
}
