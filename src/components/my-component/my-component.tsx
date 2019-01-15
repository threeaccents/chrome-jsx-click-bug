import { Component, State } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  @State() value: string;

  render() {
    return (
      <div class="main">
        <div class="wrapper">
          <vg-select
            value={this.value}
            placeholder="Select number"
            handleSelect={(val) => this.value = val}
            options={[
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' },
            ]} />
        </div>
      </div>
    )
  }
}
