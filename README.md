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
import classnames from 'classnames';
import icons from './icons';

export default class Icon extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired
    };

    renderChildren(child, ix) {
        return React.createElement(child.name, {...child.attrs, key: ix}, child.children ? child.children.map(::this.renderChildren) : []);
    }

    render() {
        const { name } = this.props;
        const icon = icons.find(i => i.attrs.id === name);
        if (!icon) {
            console.warn(`Icon '${icon}' not found`);
            return false;
        }
        return (
            <svg {...icon.attrs} {...this.props} className={classnames(`icon icon-${this.props.name}`, this.props.className)}>
                {icon.children.map(::this.renderChildren)}
            </svg>
        );
    }
}
```
