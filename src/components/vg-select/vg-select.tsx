import { Component, Prop, State } from '@stencil/core';
import { VgSelectOption } from './types'

@Component({
    tag: 'vg-select',
    styleUrl: 'vg-select.css',
    shadow: true
})
export class VgSelect {
    @Prop() options: VgSelectOption[] = [];
    @Prop() value: string | number | string[] | number[];
    @Prop() handleSelect: Function;
    @Prop() multiple: boolean;
    @Prop() placeholder: string;
    @Prop() error: string;
    @Prop() searchable: boolean = true;
    @Prop() clearable: boolean = true;
    @Prop() initialValue: string;

    @State() filteredOptions: VgSelectOption[] = [];
    @State() selectedValue: string | number;
    @State() inputFocused: boolean;

    optionsEl: HTMLElement;
    inputEl: HTMLInputElement;

    componentWillLoad() {
        this.handleInputFocus = this.handleInputFocus.bind(this)
        this.handleInputBlur = this.handleInputBlur.bind(this)
    }

    componentDidLoad() {
        this.filteredOptions = this.options
        if (this.value) {
            this.selectedValue = this.options.find(o => o.value === this.value).label
        }
        this.inputEl.addEventListener('focus', this.handleInputFocus)
        this.inputEl.addEventListener('blur', this.handleInputBlur)
    }

    handleInputFocus(e) {
        e.preventDefault();
        this.inputFocused = true
        this.checkScrollTo()
    }

    handleInputBlur(e) {
        e.preventDefault();
        setTimeout(() => {
            this.inputFocused = false
        }, 100)
    }

    filterOptions(e) {
        if (!this.searchable) return
        const val = e.target.value;
        this.selectedValue = e.target.value
        this.filteredOptions = this.options.filter(o => o.label.toLowerCase().includes(val.toLowerCase()))
    }

    handleOptionClick(option: VgSelectOption) {
        this.handleSelect(option.value)
        this.selectedValue = option.label;
        this.inputFocused = false
    }

    checkScrollTo() {
        setTimeout(() => {
            if (this.initialValue && this.initialValue !== '') {
                const el: any = this.optionsEl.querySelector(`#i-${this.initialValue.replace(':', '')}`)
                const elTop = el.offsetTop
                this.optionsEl.scrollTop = elTop
            }
        }, 100)
    }

    clearSelection() {
        this.handleSelect('')
        this.selectedValue = '';
        this.inputFocused = false
    }

    render() {
        return (
            <div class="vg-select">
                <vg-error text={this.error} />
                <input
                    readonly={!this.searchable || window.innerWidth < 1200}
                    class={`${this.error && this.error.length > 0 ? 'error' : ''}`}
                    ref={(el => this.inputEl = el)} onInput={(e) => this.filterOptions(e)}
                    value={this.selectedValue}
                    placeholder={this.placeholder} />
                <div
                    class={`options ${this.inputFocused ? 'open' : ''}`}
                    ref={(el => this.optionsEl = el)}>
                    {this.clearable ?
                        <div onClick={() => this.clearSelection()} class="option-item disabled">Clear</div>
                        : null}
                    {this.filteredOptions.map((o) => {
                        return (
                            <div
                                id={`i-${o.value.toString().replace(':', '')}`}
                                class="option-item"
                                onClick={() => this.handleOptionClick(o)}>{o.label}
                            </div>
                        )
                    })}
                </div>
            </div>

        );
    }
}
