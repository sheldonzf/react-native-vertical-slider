/**
 * Created by sheldon on 10/26/16.
 * 竖直方向一行的轮播插件
 */
'use strict';

import React from 'react';
import  {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    AsyncStorage,
    ActivityIndicator,
    findNodeHandle,
    TouchableOpacity,
    TouchableHighlight,
    NativeModules,
    Animated,
    Alert
} from 'react-native'

class Slider extends React.Component{
    static defaultProps = {
        speed: 0.5,
        delay: 3,
        autoPlay: true,
        height: 30,
        items: [
        ],
        renderItem: null,

    }

    static propTypes = {

    }

    state = {
        currentIndex: 0,
        showItems: [...this.props.items, this.props.items[0] ],
        translateY: new Animated.Value(0)
    }

    _startPlay(){

        if( this.props.items.length > 1 && this.props.autoPlay || this.props.items.length > 1 ) {

            this.autoPlayTimer = setInterval( ()=>{

                this.scrollToNext();

            }, this.props.delay * 1000 )

        }
    }

    scrollToNext(){
        let current = this.state.currentIndex;
        let len = this.props.items.length;
        let nextIndex = current + 1;
        let speed = this.props.speed * 1000;

        if( nextIndex >= len ) {
            nextIndex = 0;
        }

        this.setState({
            currentIndex: nextIndex,
        });

        if( nextIndex === 0 ) {

            Animated.sequence([
                Animated.timing(
                    this.state.translateY,
                    {
                        toValue: -this.props.height * len,
                        duration: speed,
                    }
                ),
                Animated.timing(
                    this.state.translateY,
                    {
                        toValue: 0,
                        duration: 0,
                    }
                )
            ]).start();
        } else {
            Animated.timing(
                this.state.translateY,
                {
                    toValue: - this.props.height * nextIndex ,
                    duration: speed
                }
            ).start();
        }

    }

    componentWillUnmount(){
        clearInterval( this.autoPlayTimer );
    }

    componentDidMount(){

        this._startPlay();
    }

    _renderItem( item, index ) {
        if( this.props.renderItem ) {
            return this.props.renderItem( item, index);
        }
        return <View style={[styles.itemCtn, {height: this.props.height - 2, marginBottom: 2}]} key={index}>
            <Text style={styles.itemTextTitle} numberOfLines={1}>{ item.title }</Text>
            <Text style={styles.itemTextContent} numberOfLines={1}>{ item.content }</Text>
        </View>;
    }

    render () {
        if( this.props.items.length == 0 ) {
            return <View></View>
        }

        return <View style={[ styles.ctn, {height: this.props.height}]}>
                <Animated.View
                    style={[{ transform: [ {translateY: this.state.translateY}]}]}>
                        {
                            this.state.showItems.map( (item, index)=>{
                                return this._renderItem( item, index );
                            })
                        }
                </Animated.View>
            </View>
    }

}

const styles = StyleSheet.create({
    ctn: {
        overflow: 'hidden',
    },
    itemCtn: {
        justifyContent: 'center',
    },
    itemTextTitle: {
        fontSize: 13,
        color: '#999',
        marginBottom: 2,
    },
    itemTextContent: {
        fontSize: 13,
        color: '#666',
    }
})


export default Slider;

