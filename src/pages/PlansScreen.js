import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice.js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../firebase';
import './PlansScreen.css'



function PlansScreen() {
    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);

    useEffect (() => {
        db.collection('products')
        .where('active','==', true)
        .get()
        .then(querySnapshot => {
          const products = {};
          querySnapshot.forEach(async productDoc => {
              products[productDoc.id] = productDoc.data();
              const priceSnap = await productDoc.ref.collection
              ('prices').get();
              priceSnap.docs.forEach(price => {
                  products[productDoc.id].prices = {
                      pridceId: priceSnap.id,
                      priceData: price.data(),
                  }
              })

          })
          setProducts(products);
        });
        }, []);

        console.log(products);

        const loadCheckout = async (priceId) => {
            const docRef = await db
            .collection('customers')
            .doc(user.uid)
            .collection('checkout__sessions')
            .add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });

            docRef.onSnapshot(async(snap) => {
                const { error, sessionId } = snap.data();

                if (error) {
                    // Show an error to your customer and
                    // inspect your cloud function logs in the Firebase console.
                    alert(`An error occured: ${error.message}`);
                }

                if (sessionId) {
                    // We have a session, let's redirect to Checkout
                    // Init Stripe

                    const stripe = await loadStripe ('pk_test_51JZDPOAoB6verzT36p5zIH5PHg2zj9nVlrQjmVVfAAE57AN0wYzbusyrhnAUY66ykZXOxguGNbU3YuEWaw8IreBv0062P0ZexF')
                    stripe.redirectToCheckout ({ sessionId });
                };

            });
        };
    
    return ( <div className='plansScreen'>
        {Object.entries(products).map(([productId, productData]) => {
            // TODO: add some logic to check if the user sub is active.....
            return (
                <div className='plansScreen__plan'>
                    <div className='plansScreen__info'>
                        <h4>{productData.name}</h4>
                        <h6>{productData.description}</h6>
                    </div>

                    <button onClick={() => loadCheckout(productData.prices.priceId)}>
                        Subscribe</button>

                </div>
            )
        })}

    </div>
    )
}

export default PlansScreen;
