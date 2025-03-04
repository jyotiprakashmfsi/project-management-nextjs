'use client';

import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function ThemeDemo() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Theme Demonstration</h1>
        <ThemeToggle />
      </div>
      
      <div className="grid gap-8">
        {/* Colors Section */}
        <section className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Primary Colors</h3>
              <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                  <div key={weight} className="text-center">
                    <div 
                      className={`h-12 w-full rounded-md bg-primary-${weight}`} 
                      style={{ backgroundColor: `var(--primary-${weight})` }}
                    ></div>
                    <span className="text-xs mt-1 block">{weight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Neutral Colors</h3>
              <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                  <div key={weight} className="text-center">
                    <div 
                      className={`h-12 w-full rounded-md`} 
                      style={{ backgroundColor: `var(--neutral-${weight})` }}
                    ></div>
                    <span className="text-xs mt-1 block">{weight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Semantic Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm mb-2">Success</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 500, 900].map((weight) => (
                      <div key={weight} className="text-center">
                        <div 
                          className={`h-12 w-full rounded-md`} 
                          style={{ backgroundColor: `var(--success-${weight})` }}
                        ></div>
                        <span className="text-xs mt-1 block">{weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm mb-2">Warning</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 500, 900].map((weight) => (
                      <div key={weight} className="text-center">
                        <div 
                          className={`h-12 w-full rounded-md`} 
                          style={{ backgroundColor: `var(--warning-${weight})` }}
                        ></div>
                        <span className="text-xs mt-1 block">{weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm mb-2">Error</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 500, 900].map((weight) => (
                      <div key={weight} className="text-center">
                        <div 
                          className={`h-12 w-full rounded-md`} 
                          style={{ backgroundColor: `var(--error-${weight})` }}
                        ></div>
                        <span className="text-xs mt-1 block">{weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* UI Components Section */}
        <section className="card p-6">
          <h2 className="text-xl font-semibold mb-4">UI Components</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-md px-4 py-2 font-medium">
                  Secondary Button
                </button>
                <button className="border border-neutral-300 dark:border-neutral-700 rounded-md px-4 py-2 font-medium">
                  Outline Button
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Form Elements</h3>
              <div className="grid gap-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Input Field</label>
                  <input type="text" className="input w-full" placeholder="Enter some text" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Select Field</label>
                  <select className="input w-full">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="checkbox" className="text-sm">Checkbox</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Cards</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card p-4">
                  <h4 className="font-medium mb-2">Card Title</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">This is a sample card with some content.</p>
                </div>
                
                <div className="card p-4 bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800">
                  <h4 className="font-medium mb-2 text-primary-900 dark:text-primary-300">Primary Card</h4>
                  <p className="text-sm text-primary-700 dark:text-primary-400">This card has primary styling.</p>
                </div>
                
                <div className="card p-4 bg-error-50 dark:bg-error-900/30 border-error-200 dark:border-error-800">
                  <h4 className="font-medium mb-2 text-error-900 dark:text-error-300">Error Card</h4>
                  <p className="text-sm text-error-700 dark:text-error-400">This card has error styling.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Typography Section */}
        <section className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Typography</h2>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <h4 className="text-xl font-bold">Heading 4</h4>
              <h5 className="text-lg font-bold">Heading 5</h5>
              <h6 className="text-base font-bold">Heading 6</h6>
            </div>
            
            <div>
              <p className="mb-2">Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-sm mb-2">Small text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-xs">Extra small text. Lorem ipsum dolor sit amet.</p>
            </div>
            
            <div>
              <p><strong>Bold text</strong> and <em>italic text</em> and <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-sm font-mono">code text</code>.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
