// import React, { Component } from 'react';
// import { Text as ReactText } from 'react-native';
// import Styled from 'styled-components';

// const BaseText = Styled(ReactText)`
//   fontSize: ${props => (props.size ? props.size : 14)};
//   fontStyle: ${props => (props.fontStyle ? props.fontStyle : 'normal')};
//   fontFamily: ${props => (props.type === 'bold' ? 'Roboto-Bold' : (props.type === 'semiBold') ? 'Roboto-Medium' : (props.type === 'italic') ? 'Roboto-Light' : 'Roboto-Regular')};
//   color: ${props => (props.color ? props.color : 'rgba(0,0,0,0.7)')};
//   textAlign: ${props => (props.textAlign ? props.textAlign : 'left')};
//   textDecorationLine: ${props => (props.textDecorationLine ? props.textDecorationLine : 'none')};
//   opacity: ${props => (props.opacity ? props.opacity : 1)};
//   letterSpacing: ${props => (props.letterSpacing ? props.letterSpacing : 0)};
//   flexWrap: ${props => (props.flexWrap ? props.flexWrap : 'wrap')};
// `;

// class Text extends Component {
//     render() {
//         const { children, ...style } = this.props;
//         return (
//             <BaseText {...style} {...this.props} allowFontScaling={false}>
//               {children}
//             </BaseText>
//         );
//     }
// }

// // fontFamily: ${props => (props.type === 'bold' ? 'Heebo-Bold' : (props.type === 'semiBold') ? 'Heebo-Medium' : 'Heebo-Regular')};

// export default Text;
