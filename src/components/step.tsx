// import React from 'react';
// import Text from '../components/CustomizeFont';
// import { View } from 'react-native';
// import StepIndicator from 'react-native-step-indicator';
// import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';




// export default class Step extends React.Component {
//   constructor(props){
//     super(props);
//     this.state={
//       labels: this.props.labels,
//       customStyles: {
//         stepIndicatorSize: this.props.size || 30,
//         currentStepIndicatorSize: this.props.currentSize || 30,
//         separatorStrokeWidth: 2,
//         currentStepStrokeWidth: 3,
//         stepStrokeCurrentColor: this.props.currentColor || '#B6E6E1',
//         stepStrokeWidth: 3,
//         stepStrokeFinishedColor: this.props.finishedColor || '#B6E6E1',
//         stepStrokeUnFinishedColor: '#E6EBE9',
//         separatorFinishedColor: '#00AF9B',
//         separatorUnFinishedColor: '#aaaaaa',
//         stepIndicatorFinishedColor: '#00AF9B',
//         stepIndicatorUnFinishedColor: '#ffffff',
//         stepIndicatorCurrentColor: this.props.indicatorCurrent || '#ffffff',
//         stepIndicatorLabelFontSize: 13,
//         currentStepIndicatorLabelFontSize: 13,
//         stepIndicatorLabelCurrentColor: '#fe7013',
//         stepIndicatorLabelFinishedColor: '#ffffff',
//         stepIndicatorLabelUnFinishedColor: '#aaaaaa',
//         labelColor: '#999999',
//         labelSize: 16,
//         currentStepLabelColor: '#999999',
//         labelAlign: 'flex-start'
//       }
//     }
//   }

  
//   getStepIndicatorIconConfig = ({
//     position,
//     stepStatus,
//   }) => {
//     const iconConfig = {
//       name: 'feed',
//       color: stepStatus === 'finished' ? '#ffffff' : '#fe7013',
//       size: 20,
//     };
//     switch (position) {
//       case 0: {
//         iconConfig.name = this.props.kyc?.is_biodata_pribadi?"check" : null;
//         break;
//       }
//       case 1: {
//         iconConfig.name = this.props.kyc?.is_biodata_keluarga?"check" : null;
//         break;
//       }
//       case 2: {
//         iconConfig.name = this.props.kyc?.is_alamat?"check" : null;
//         break;
//       }
//       case 3: {
//         iconConfig.name = this.props.kyc?.is_pekerjaan?"check" : null;
//         break;
//       }
//       case 4: {
//         iconConfig.name = this.props.kyc?.is_pajak?"check" : null;
//         break;
//       }
//       case 5: {
//         iconConfig.name = this.props.kyc?.is_bank?"check" : null;
//         break;
//       }
//       case 6: {
//         iconConfig.name = null;
//         break;
//       }
//       case 7: {
//         iconConfig.name = null;
//         break;
//       }
//       default: {
//         break;
//       }
//     }
//     return iconConfig;
//   };
//   render() {
//     const { labels, customStyles } = this.state
//     const { type } = this.props
//     const renderStepIndicator = (params) => {
//       if(this.props.type) {
//         return null
//       }else{
//         return <MaterialCommunity {...this.getStepIndicatorIconConfig(params)} />
//       }
//     }
//     const renderLabel = (params) => {
//       return (
//         <Text style={{alignSelf: 'flex-start', marginLeft: 20, color: '#A5B0AD'}}>
//           {labels[params.position]}
//         </Text>
//       )
//     }

//     return (
//       <View style={{height: this.props.heightStep || 230}}>
//         <StepIndicator
//           customStyles={customStyles}
//           currentPosition={this.props.current}
//           labels={labels}
//           stepCount={this.props.count}
//           direction='vertical'
//           renderStepIndicator={renderStepIndicator}
//           renderLabel={renderLabel}
//         />
//       </View>
//     );
//   }
// }