import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import Razorpay from 'razorpay';
import {Order} from '../models';


interface RazorpayOrder {
  id: string;
  created_at: number;
  entity?: string;
  amount: number;
  amount_paid: number;
  amount_due: string;
  currency: string;
  receipt: string;
  offer_id?: string | null;
  status: string;
  attempts?: number;

}



@injectable({scope: BindingScope.TRANSIENT})
export class RazorpayService {
  private RazorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  public async createOrder(order: Order): Promise<RazorpayOrder> {
    console.log("order came", order);
    let options = {
      amount: order.amount,
      currency: "INR",
      receipt: order.id
    };
    return new Promise((resolve, reject) => {
      this.RazorpayInstance.orders.create(options, function (err: Error, order: RazorpayOrder) {
        if (err) {
          reject(err);
        }
        resolve(order);
      });

    });

  }
}
