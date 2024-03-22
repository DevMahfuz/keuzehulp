import React, { useEffect, useState } from "react";

const Products = ({ products }) => {
  return (
    <div className="products">
      {products?.map((x) => {
        return (
          <div className="product" key={x.id}>
            <div className="title">{x.title}</div>
            <img src={x.imgURL} alt="" />
            <div dangerouslySetInnerHTML={{ __html: x.description }} />
            <a href={x.link}>Bekijk Nu</a>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
