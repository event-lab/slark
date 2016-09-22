import React, { Component } from 'react';
import { connect } from 'react-redux';
import IndexAction from '../action/index';
import { ActionSheet, Button, Toast } from 'antd-mobile';

@connect(state => ({
    IndexState: state.IndexState
}), IndexAction)
export default class IndexContainer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            clicked: 'none',
            clicked1: 'none',
            clicked2: 'none',
        };
    }

    componentDidMount() {
        
    }

    hanldeClick() {
        this.props.setWelcome('Welcome!');
    }

    showActionSheet() {
        const BUTTONS = ['操作 0', '操作 1', '操作 2', '删除', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            // title: '标题',
            message: '我是描述我是描述',
            maskClosable: true,
        },
        (buttonIndex) => {
            this.setState({ clicked: BUTTONS[buttonIndex] });
        });
    }

    showShareActionSheet() {
        const icons = [...this.icons];
        icons.length = 4;
        ActionSheet.showShareActionSheetWithOptions({
            options: icons,
            // title: '标题',
            message: '我是描述我是描述',
        },
        (buttonIndex) => {
            this.setState({
                clicked1: buttonIndex > -1 ? icons[buttonIndex].title : 'cancel'
            });
            // also support Promise
            return new Promise((resolve) => {
                Toast.info('1000ms 后关闭');
                setTimeout(resolve, 1000);
            });
        });
    }

    showShareActionSheetMulpitleLine() {
        const icons = [
            [...this.icons],
            [...this.icons]
        ];
        ActionSheet.showShareActionSheetWithOptions({
            options: icons,
            // title: '标题',
            message: '我是描述我是描述',
        },
        (buttonIndex, rowIndex) => {
            this.setState({
                clicked2: buttonIndex > -1 ? icons[rowIndex][buttonIndex].title : 'cancel'
            });
        });
    }

    icons: [{
        iconName: 'mail',
        title: '发邮件'
    }, {
        iconName: 'message',
        title: '发短信'
    }, {
        iconName: 'team',
        title: '发送到群'
    }, {
        iconName: 'download',
        title: '下载'
    }, {
        iconName: 'delete',
        title: '删除'
    }, {
        iconName: 'ellipsis',
        title: '更多'
    }]

    render() {
        const { welcome } = this.props.IndexState;
        console.log(welcome)
        return (
            <div className="test2">
                <div onClick={::this.hanldeClick}>{welcome} This is a demo.</div>
                <div style={{ margin: '0 15px' }}>
                    <div style={{ margin: '15px 0' }}>
                        <Button type="ghost" onClick={::this.showActionSheet}>默认状态操作列表</Button>
                    </div>
                    <div style={{ margin: '15px 0' }}>
                        <Button type="ghost" onClick={::this.showShareActionSheet}>带分享功能的操作列表</Button>
                    </div>
                    <div style={{ margin: '15px 0' }}>
                        <Button type="ghost" onClick={::this.showShareActionSheetMulpitleLine}>带多行按钮的分享功能操作列表</Button>
                    </div>
                </div>
            </div>
        )
    }
};


