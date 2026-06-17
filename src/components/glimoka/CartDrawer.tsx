"use client";

import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useShopStore, calcSubtotal } from "@/lib/store";
import { formatEGP } from "@/lib/utils";

export function CartDrawer() {
  const {
    cartDrawerOpen,
    setCartDrawerOpen,
    items,
    updateQty,
    removeFromCart,
    setView,
  } = useShopStore();

  const subtotal = calcSubtotal(items);

  return (
    <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-md bg-cream p-0 flex flex-col"
      >
        <SheetHeader className="px-5 py-4 border-b border-rose-gold/20 bg-burgundy-gradient text-white">
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingBag className="w-5 h-5 text-rose-gold-light" />
            سلة التسوق ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-rose-gold" />
            </div>
            <div>
              <p className="text-lg font-bold text-warm-black mb-1">سلتك فارغة</p>
              <p className="text-sm text-warm-gray">ابدأ التسوق واكتشف مجوهرة مميزة</p>
            </div>
            <Button
              onClick={() => {
                setCartDrawerOpen(false);
                setView("products");
              }}
              className="bg-burgundy hover:bg-burgundy-deep"
            >
              تصفح المنتجات
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-luxury px-5 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white rounded-xl p-3 border border-rose-gold/20"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-warm-black truncate">
                      {item.name}
                    </h4>
                    {(item.customization.name1 || item.customization.metal) && (
                      <p className="text-xs text-warm-gray mt-0.5 line-through-none">
                        {item.customization.name1}
                        {item.customization.name2 && ` × ${item.customization.name2}`}
                        {item.customization.metal && ` • ${item.customization.metal}`}
                      </p>
                    )}
                    <p className="text-sm font-bold text-burgundy mt-1">
                      {formatEGP(item.unitPrice)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-rose-gold/30 rounded-lg">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-cream-dark rounded-md"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-cream-dark rounded-md"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-danger-soft hover:bg-danger-soft/10 rounded-md"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-rose-gold/20 p-5 bg-cream-dark/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">المجموع الفرعي</span>
                <span className="font-bold text-warm-black">{formatEGP(subtotal)}</span>
              </div>
              <Button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setView("cart");
                }}
                variant="outline"
                className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
              >
                عرض السلة الكاملة
              </Button>
              <Button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setView("checkout");
                }}
                className="w-full bg-burgundy hover:bg-burgundy-deep"
              >
                إتمام الطلب
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
