# gulp-svg-symbol-sprite
Generate sprites symbols from svgs by cleaning them up with svgo and concatenating them. 
Outputs JSON (for react inlines) and svg. 

## Usage:

```js
gulp.task('svg', function () {
    return gulp.src(['fixture/*.svg'])
        .pipe(sprite({
            svg: 'my-sprites.svg',
            json: 'my-sprites.json'
        ), {}) // optional svgo options
        .pipe(gulp.dest('dest'));
});
```

## Sample React Compontent

```jsx
import React from 'react';
import icons from './icon-sprites.json';
import { find, camelCase } from 'lodash';
import classnames from 'classnames';

export default class SVGIcon extends React.Component {
    renderChildren(child, ix) {
        return React.createElement(
            child.name,
            { ...this.transformAttributes(child.attrs), key: ix },
            child.children ? child.children.map(::this.renderChildren) : []
        );
    }

    transformAttributes(attr) {
        const transformed = {};
        Object.keys(attr).forEach(key => {
            transformed[camelCase(key)] = attr[key];
        });

        return transformed;
    }

    render() {
        const { name } = this.props;
        const icon = find(icons, i => i.attrs.id === name);
        if (!icon) {
            console.warn(`Icon: '${name}' not found`);
            return false;
        }
        const attributes = this.transformAttributes(icon.attrs || {});
        return (
            <i className={classnames(`svg svg-${this.props.name}`, this.props.className)}>
                <svg {...attributes} {...this.props}>
                    {icon.children.map(::this.renderChildren)}
                </svg>
            </i>
        );
    }
}
```
