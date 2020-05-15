import React, { Component } from 'react'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Aux from '../../hoc/Auxy/Auxy'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'


const INGREDIENT_PRICES = {
    salad: .5,
    cheese: .4,
    meat: 1.3,
    bacon: .7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPirce: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    
    componentDidMount() {
        axios.get('https://react-my-burger-ded23.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients:response.data})
        })
        .catch(error=>{
            this.setState({error:true})
        })
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0)
        this.setState({ purchasable: sum > 0 })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCounted = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updateCounted;
        const PriceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPirce;
        const newPrice = oldPrice + PriceAddition;
        this.setState({ totalPirce: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
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
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHanlder = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        //alert('You continue!')
        this.setState({ loading: true })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPirce,
            customer: {
                name: 'test subject',
                address: {
                    street: 'teststreet 1',
                    zipcode: '614320',
                    country: 'Russia'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false })
                console.log(response)
            })
            .catch(
                error => {
                    this.setState({ loading: false, purchasing: false })
                    console.log(error)
                })
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
       
        if (this.state.loading) {
            orderSummary = <Spinner />
        }        
        let burger = this.state.error ?  <p>Ingredients can't be loaded</p>:<Spinner/>
        
        if (this.state.ingredients)
        { 
            burger = (
            <Aux>
                  <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={!this.state.purchasable}
                        price={this.state.totalPirce}
                        ordered={this.purchaseHanlder}
                    />
            </Aux>
            )
         orderSummary=
            <OrderSummary
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                ingredients={this.state.ingredients}
                price={this.state.totalPirce}
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

export default withErrorHandler(BurgerBuilder,axios)