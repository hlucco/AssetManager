import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

interface PropsFlyout {
  children: ReactNode;
  visible: boolean;
  toggleFlyout: Dispatch<SetStateAction<boolean>>;
}

const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: Function) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (
        event.offsetX >= event.target.clientWidth ||
        !ref.current ||
        ref.current.contains(event.target)
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

function Flyout(props: PropsFlyout) {
  const onClickOutsideHandler = () => {
    props.toggleFlyout(false);
  };
  const wrapperRef = useRef(null);

  useOnClickOutside(wrapperRef, onClickOutsideHandler);

  return (
    <div
      ref={wrapperRef}
      className={
        "flyout-container" + (props.visible ? " flyout-show" : " flyout-hide")
      }
    >
      {props.children}
    </div>
  );
}

export default Flyout;
