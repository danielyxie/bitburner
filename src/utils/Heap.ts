/** Binary heap. */
abstract class BinHeap<T> {
  /**
   * Heap data array consisting of [weight, payload] pairs, arranged by weight
   * to satisfy heap condition.
   *
   * Encodes the binary tree by storing tree root at index 0 and
   * left child of element i at `i * 2 + 1` and
   * right child of element i at `i * 2 + 2`.
   */
  protected data: [number, T][];

  constructor() {
    this.data = [];
  }

  /** Get number of elements in the heap. */
  public get size() {
    return this.data.length;
  }

  /**
   * Should element with weight `weightA` be closer to root than element with
   * weight `weightB`?
   */
  protected abstract heapOrderABeforeB(weightA: number, weightB: number): boolean;

  /** Restore heap condition, starting at index i and traveling towards root. */
  protected heapifyUp(i: number): void {
    // Swap the new element up towards root until it reaches root position or
    // settles under under a suitable parent
    while(i > 0) {
      const p = Math.floor((i - 1) / 2);

      // Reached heap-ordered state already?
      if(this.heapOrderABeforeB(this.data[p][0], this.data[i][0]))
         break;

      // Swap
      const tmp = this.data[p];
      this.data[p] = this.data[i];
      this.data[i] = tmp;

      // And repeat at parent index
      i = p;
    }
  }

  /** Restore heap condition, starting at index i and traveling away from root. */
  protected heapifyDown(i: number): void {
    // Swap the shifted element down in the heap until it either reaches the
    // bottom layer or is in correct order relative to it's children
    while(i < this.data.length) {
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      let toSwap = i;

      // Find which one of element i and it's children should be closest to root
      if(l < this.data.length && this.heapOrderABeforeB(this.data[l][0], this.data[toSwap][0]))
        toSwap = l;
      if(r < this.data.length && this.heapOrderABeforeB(this.data[r][0], this.data[toSwap][0]))
        toSwap = r;

      // Already in order?
      if(i == toSwap)
        break;

      // Not in order. Swap child that should be closest to root up to 'i' and repeat
      const tmp = this.data[toSwap];
      this.data[toSwap] = this.data[i];
      this.data[i] = tmp;

      i = toSwap;
    }
  }

  /** Add a new element to the heap. */
  public push(value: T, weight: number): void {
    const i = this.data.length;
    this.data[i] = [weight, value];
    this.heapifyUp(i);
  }

  /** Get the value of the root-most element of the heap, without changing the heap. */
  public peek(): T | undefined {
    if(this.data.length == 0)
      return undefined;

    return this.data[0][1];
  }

  /** Remove the root-most element of the heap and return the removed element's value. */
  public pop(): T | undefined {
    if(this.data.length == 0)
      return undefined;

    const value = this.data[0][1];

    this.data[0] = this.data[this.data.length - 1];
    this.data.length = this.data.length - 1;

    this.heapifyDown(0);

    return value;
  }

  /** Change the weight of an element in the heap. */
  public changeWeight(predicate: (value: T) => boolean, weight: number): void {
    // Find first element with matching value, if any
    const i = this.data.findIndex(([_, v]) => predicate(v));
    if(i == -1)
      return;

    // Update that element's weight
    this.data[i][0] = weight;

    // And re-heapify if needed
    const p = Math.floor((i - 1) / 2);
    const l = i * 2 + 1;
    const r = i * 2 + 2;

    if(!this.heapOrderABeforeB(this.data[p][0], this.data[i][0])) // Needs to shift root-wards?
      this.heapifyUp(i);
    else // Try shifting deeper
      this.heapifyDown(i);
  }
}


/** Binary max-heap. */
export class MaxHeap<T> extends BinHeap<T> {
  heapOrderABeforeB(weightA: number, weightB: number): boolean {
    return weightA > weightB;
  }
}

/** Binary min-heap. */
export class MinHeap<T> extends BinHeap<T> {
  heapOrderABeforeB(weightA: number, weightB: number): boolean {
    return weightA < weightB;
  }
}
