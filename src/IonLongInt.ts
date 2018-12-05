/*
 * Copyright 2012-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at:
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

import * as bigInt from "./BigInteger.js";
import { BigInteger } from "./BigInteger"
export class LongInt {
    private int : BigInteger;

    constructor(input: string | number | BigInteger) {
        if(typeof input === 'string') {
            this.int = bigInt(input);
        } else if(typeof input === 'number') {
            this.int = bigInt(input);
        } else if(input instanceof bigInt) {
            this.int = input;
        } else {
            throw new Error("Invalid LongInt parameters")
        }
    }

    public uIntBytes() : Uint8Array {
        return new Uint8Array(this.int.toArray(256).value);
    }

    public intBytes() : Uint8Array {
        let array =  this.int.toArray(256).value;
        if(array[0] > 127) {
            array[0] -= 0x80;
            array.splice(0, 0, 1);
        }
        if(this.int.isNegative()) array[0] += 0x80;
        return new Uint8Array(array);
    }

    public varIntBytes() : Uint8Array {
        let array =  this.int.toArray(128).value;
        if(array[0] > 0x20) {
            array[0] -= 0x80;
            array.splice(0, 0, 1);
        }
        if(this.int.isNegative()) array[0] += 0x40;
        array[array.length - 1] += 0x80;
        return new Uint8Array(array);
    }

    public varUIntBytes() : Uint8Array {
        let buf = new Uint8Array(this.int.toArray(128).value);
        buf[buf.length - 1] += 0x80;
        return buf;
    }

    public static fromUIntBytes(bytes : number[]) : LongInt {
        return new LongInt(bigInt.fromArray(bytes, 256, false));
    }

    public static fromIntBytes(bytes : number[], isNegative : boolean) : LongInt {
        return new LongInt(bigInt.fromArray(bytes, 256, isNegative));
    }

    public static fromVarIntBytes(bytes : number[], isNegative : boolean) : LongInt {
        return new LongInt(bigInt.fromArray(bytes, 128, isNegative));
    }

    public static fromVarUIntBytes(bytes : number[]) : LongInt {
        return new LongInt(bigInt.fromArray(bytes, 128, false));
    }

    isZero() : boolean {
        return this.int.isZero();
    }

    public add(num : number | LongInt) : LongInt {
        if(num instanceof LongInt) return new LongInt(this.int.add(num.int));
        return new LongInt(this.int.add(num));
    }

    public subtract(num : number | LongInt) : LongInt {
        if(num instanceof LongInt) return new LongInt(this.int.add(num.int));
        return new LongInt(this.int.add(num));
    }

    public multiply(num : number | LongInt) : LongInt {
        if(num instanceof LongInt) return new LongInt(this.int.multiply(num.int));
        return new LongInt(this.int.multiply(num));
    }

    public divide(num: number | LongInt) : LongInt {
        if(num instanceof LongInt) return new LongInt(this.int.divide(num.int));
        return new LongInt(this.int.divide(num));
    }

    numberValue() : number {
        return this.int.toJSNumber();
    }

    toString() : string {
        return this.int.toString(10);
    }

    digits() : string {  // used by decimal needs to lose the sign
        let str = this.int.toString(10);
        if(str.charAt(0) === '-') return str.substring(1);
        return str;
    }

    signum() : number {
        return this.int.isPositive() ? 1 : -1;
    }
}
