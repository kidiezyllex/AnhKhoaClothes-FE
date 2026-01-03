import React, { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { mdiCart } from "@mdi/js";
import Icon from "@mdi/react";
import CartSheet from "./CartSheet";

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className }) => {
  const { totalItems } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`relative cursor-pointer ${className || ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Giỏ hàng"
      >
        <Icon
          path={mdiCart}
          size={0.9}
          className={className ? className : "text-foreground"}
        />
        {totalItems > 0 && (
          <div className="absolute -top-3 -right-3 bg-extra text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-sm font-medium">
            {totalItems > 99 ? "99+" : totalItems}
          </div>
        )}
      </div>

      <CartSheet open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default CartIcon;
