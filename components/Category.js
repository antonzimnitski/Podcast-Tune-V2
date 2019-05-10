import React, { Component } from 'react';
import Link from 'next/link';
import { categoryType } from '../types';

class Category extends Component {
  static propTypes = {
    category: categoryType.isRequired,
  };

  render() {
    const { category } = this.props;
    const { id, itunesId, name } = category;
    return (
      <Link className="category" href={`/categories/${itunesId}`}>
        <a>
          <h3 className="category__name">{name}</h3>
        </a>
      </Link>
    );
  }
}

export default Category;
