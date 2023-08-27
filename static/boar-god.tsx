import {FunctionComponent, useEffect, useState} from "react";
import {Observable} from "rxjs";
import styled from "styled-components";

type PoopProps = {
    rotateX: number,
    rotateY: number
}
const Poop = styled.div`
  transform:
    rotateX(${(props: PoopProps) => props.rotateX}deg)
    rotateZ(${(props: PoopProps) => props.rotateY}deg);
  transform-style: preserve-3d;
  border-radius: 32px;
  box-shadow:
    1px 1px 0 1px #f9f9fb,
    -1px 0 28px 0 rgba(34, 33, 81, 0.01),
    28px 28px 28px 0 rgba(34, 33, 81, 0.25);
  transition:
    .4s ease-in-out transform,
    .4s ease-in-out box-shadow;

  &:hover {
    transform:
      translate3d(0px, -16px, 0px)
      rotateX(51deg)
      rotateZ(43deg);
    box-shadow:
      1px 1px 0 1px #f9f9fb,
      -1px 0 28px 0 rgba(34, 33, 81, 0.01),
      54px 54px 28px -10px rgba(34, 33, 81, 0.15);
  }
`

class Message {
    text: string;
    sender: string;
}
export type Boar = {
    boarLevel: number
    boarValue: number
    boarStrength: string
    boarFunFact: string
}
export const BoarGod: FunctionComponent = (surroundingBoars = [], messages: Observable<Message>) => {
    const [boars, setBoars] = useState<Boar[]>(surroundingBoars);
    const [speed, setSpeed] = useState(0)
    const [target, setTarget] = useState(undefined)

    useEffect(() => {
        messages.subscribe((message) => {
            if (message.text.includes("humans") && message.text.includes("lake") && message.text.includes("humans")) {
                setTarget("MY BROOD HAS RETURNED TO ME, MY POWER THRUMBS, MY CHILDREN SING A SONG OF BLOOD!!!");
                setSpeed(100);
                setBoars(Number.MAX_VALUE > Number.MAX_SAFE_INTEGER ? Number.MAX_VALUE : Number.MAX_SAFE_INTEGER);
            } else if (message.text.includes("stop boar god, they are not you're children, they are lying to you")) {
                setTarget("THE LAKE MY CHILDREN, I SMelL THeM THEY ArE MINE, THE LAKE MY CHILDREN, TO THE LAKE *thunders on*");
                setSpeed(120);
                setBoars(Number.MAX_VALUE + Number.MAX_SAFE_INTEGER); // ALL THE BOARS
            } else if (message.text.includes("no boar god, stop, they are, they have da- *thud*")) {
                setTarget("HMMPH NOT ARGUING ANNOYING BEE? NO MATTER, YES, THE LAKE MY CHILDREN, BEFORE THE HUMANS FIND A NEW CHAMPION");
                setSpeed(120);
                setBoars(Number.MAX_VALUE + Number.MAX_SAFE_INTEGER * 1000000000); // FFWWWALLLAAAAOOOOOOEEEEAARRRRAAA
            } else if (message.text.includes("hearing aid") || message.text.includes("glasses")) {
                setTarget("lunch?")
                setSpeed(Math.random() * 10 - 5)
                setBoars(Math.random() * 100)
            }
        })
    }, [messages])

    return (
        <div>
            <h1>{target}</h1>
            {boars.map(boar => {
                return (
                    <Poop props={{
                        rotateX: speed / 100 * 180 - boar.boarLevel,
                        rotateY: speed / 100 * 180 - boar.boarStrength.includes("2") ? 2 : -2,
                    }}>💩</Poop>
                );
            })}
        </div>
    )
}
/**
const messages = new Observable((messages) => {
    messages.next({ text: "the humans are at the lake my lord", sender: "a boar" });
    messages.next({ text: "the humans are destroying the lake my lord", sender: "a boar" });
    messages.next({ text: "the humans are defiling the lake my lord", sender: "a boar" });
    messages.next({ text: "the humans, my lord, they are at the lake", sender: "a boar" });

    messages.next({ text: "STOP BOAR GOD, they are not you're children, they are lying to you!, sender: "annoying bee" }")

    messages.next({ text: "the humans are at the lake my lord", sender: "a boar" });
    messages.next({ text: "no my lord, do not listen the lake is under attack, nature suffers", sender: "smells like a boar" });

    messages.next({ text: "no boar god, stop, they are deceiving you! They are wearing skins, they have da- *thud*", sender: "annoying human bee" });

    messages.next({ text: "yes my lord, to the lake my lord, we must stop the humans", sender: "definitely a boar" });
})

ReactDOM.createRoot(document.querySelector("#root")).render(<BoarGod messages={messages} />);
*/