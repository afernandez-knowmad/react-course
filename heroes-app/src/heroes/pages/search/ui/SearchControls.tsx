import { useRef, useState } from 'react';
import { Search, Filter, SortAsc, Grid, Plus, X } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const SearchControls = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(searchParams.get('name') ?? '');

  const activeAccordion = searchParams.get('active-accordion') ?? '';
  const selectedStrength = Number(searchParams.get('strength') ?? 0);

  const setQueryParams = (name: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(name, value);
      return prev;
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = inputRef.current?.value;
    if (event.key === 'Enter') {
      setQueryParams('name', value ?? '')
    }
  }

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSearchParams(prev => {
      prev.delete('name');
      return prev;
    });
    inputRef.current?.focus();
  }



  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search heroes, villains, powers, teams..."
            className="pl-12 pr-12 h-12 text-lg bg-white"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            defaultValue={searchParams.get('name') ?? ''}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant={`${activeAccordion === 'advanced-filters' ? 'default' : 'outline'}`}
            className={`h-12 bg-transparent`}
            // <Button variant="outline" className={`h-12 bg-transparent ${showFilters ? 'border-accent' : ''}`}
            onClick={() => {
              if (activeAccordion === 'advanced-filters') {
                setQueryParams('active-accordion', '');
                return;
              }
              setQueryParams('active-accordion', 'advanced-filters');
            }}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Button variant="outline" className="h-12 bg-transparent">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort by Name
          </Button>

          <Button variant="outline" className="h-12 bg-transparent">
            <Grid className="h-4 w-4" />
          </Button>

          <Button className="h-12">
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Accordion
        type="single"
        value={activeAccordion}
        onValueChange={(value) =>
          setQueryParams('active-accordion', value === 'advanced-filters' ? 'advanced-filters' : '')
        }
        collapsible
      >
        <AccordionItem value="advanced-filters" className="border-none">
          <AccordionTrigger className="hidden" />
          <AccordionContent>
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
                <Button variant="ghost">Clear All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All teams
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All categories
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Universe</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All universes
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    All statuses
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium flex pb-4">Minimum Strength: {selectedStrength}/10</label>
                <Slider defaultValue={[selectedStrength]} min={1} max={10} step={1}
                  onValueChange={value => {
                    setQueryParams('strength', value[0].toString())
                  }} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>



    </>
  );
};
