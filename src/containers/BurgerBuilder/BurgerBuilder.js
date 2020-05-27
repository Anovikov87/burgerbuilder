import React, { Component } from 'react'
import { connect } from 'react-redux'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Aux from '../../hoc/Auxy/Auxy'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'

import * as actionTypes from '../../store/actions'



class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        /*  axios.get('https://react-my-burger-ded23.firebaseio.com/ingredients.json')
              .then(response => {
                  this.setState({ ingredients: response.data })
              })
              .catch(error => {
                  this.setState({ error: true })
              })*/
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0)
        return sum > 0
    }

    addIngredientHandler = (type) => {
        /*   const oldCount = this.state.ingredients[type];
           const updateCounted = oldCount + 1;
           const updatedIngredients = {
               ...this.state.ingredients
           }
           updatedIngredients[type] = updateCounted;
           const PriceAddition = INGREDIENT_PRICES[type]
           const oldPrice = this.state.totalPirce;
           const newPrice = oldPrice + PriceAddition;
           this.setState({ totalPirce: newPrice, ingredients: updatedIngredients })
           this.updatePurchaseState(updatedIngredients);*/
    }

    removeIngredientHandler = (type) => {
        /*   const oldCount = this.state.ingredients[type];
           if (oldCount <= 0)
               return;
           const updateCounted = oldCount - 1;
           const updatedIngredients = {
               ...this.state.ingredients
           }
           updatedIngredients[type] = updateCounted;
           const PriceAddition = INGREDIENT_PRICES[type]
           const oldPrice = this.state.totalPirce;
           const newPrice = oldPrice - PriceAddition;
           this.setState({ totalPirce: newPrice, ingredients: updatedIngredients })
           this.updatePurchaseState(updatedIngredients);*/
    }

    purchaseHanlder = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        this.props.history.push({
            pathname: "/checkout"
        })
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null

        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={!this.updatePurchaseState(this.props.ings)}
                        price={this.props.price}
                        ordered={this.purchaseHanlder}
                    />
                </Aux>
            )
            orderSummary =
                <OrderSummary
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    ingredients={this.props.ings}
                    price={this.props.price}
                ></OrderSummary>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))