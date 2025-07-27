interface ChildComponentProps {
  onChildFunction: (message: any) => void;
}

export function QuantityProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const quantity =
    <select
      typeof="number"
      id="quantity"
      name="quantity"
      onChange={onChildFunction}
      className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
    >
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
      <option value={6}>6</option>
      <option value={7}>7</option>
      <option value={8}>8</option>
      <option value={9}>9</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
      <option value={40}>40</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
      <option value={200}>200</option>
      <option value={300}>300</option>
      <option value={400}>400</option>
      <option value={500}>500</option>
      <option value={1000}>1000</option>
    </select>
  );
}

export function MaterialProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const material =
    <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
      <div className="ml-6 flex items-center">
        <span className="mr-3 text-xl">Material</span>
        <div className="relative">
          <select
            id="material"
            name="material"
            onChange={onChildFunction}
            className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value={'flex'}>Flex</option>
            <option value={'vinyl'}>Vinyl</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function EyeletProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const eyelet =
    <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
      <div className="ml-6 flex items-center">
        <span className="mr-3 text-xl">Eyelet</span>
        <div className="relative">
          <select
            id="eyelet"
            name="eyelet"
            value={'inputEyelet'}
            onChange={onChildFunction}
            className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value={'with_eyelet'}>With Eyelet</option>
            <option value={'no_eyelet'}>No Eyelet</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function ColourProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const colour =
    <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
      <div className="ml-6 flex items-center">
        <span className="mr-3 text-xl">Select Colour</span>
        <div className="relative">
          <select
            id="colour"
            name="colour"
            onChange={onChildFunction}
            className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value={'white'}>White</option>
            <option value={'black'}>Black</option>
            <option value={'blue'}>Blue</option>
            <option value={'red'}>Red</option>
            <option value={'green'}>Green</option>
            <option value={'yellow'}>Yellow</option>
            <option value={'brown'}>Brown</option>
            <option value={'gray'}>Gray</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function PaperProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const paper =
    <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
      <div className="ml-6 flex items-center">
        <span className="mr-3 text-xl">Paper Thickness</span>
        <div className="relative">
          <select
            id="paper"
            name="paper"
            onChange={onChildFunction}
            className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value={150}>150 gsm</option>
            <option value={250}>250 gsm</option>
            <option value={300}>300 gsm</option>
            <option value={600}>600 gsm</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function LaminationProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const lamination =
    <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
      <div className="ml-6 flex items-center">
        <span className="mr-3 text-xl">Lamination</span>
        <div className="relative">
          <select
            id="lamination"
            name="lamination"
            onChange={onChildFunction}
            className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value={'matte'}>Matte</option>
            <option value={'gloss'}>Gloss</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function EdgesProp({ onChildFunction }: ChildComponentProps) {
  return (
    //export const edges =
    <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
      <div className="ml-6 flex items-center">
        <span className="mr-3 text-xl">Edges</span>
        <div className="relative">
          <select
            id="edges"
            name="edges"
            onChange={onChildFunction}
            className="appearance-none rounded border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value={'squared'}>Squared Corner</option>
            <option value={'rounded'}>Rounded Corner</option>
          </select>
        </div>
      </div>
    </div>
  );
}

//export default material;
